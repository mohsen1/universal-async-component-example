import * as ts from 'typescript';
import * as kinds from 'ts-is-kind';

/**
 * Visit a TypeScript source file to convert async import() calls to sync import calls
 * conditioned to existence of the module in Webpack __webpack_modules__ cache otherwise
 * leaves the asynchronous import as is. It also uses __webpack_report_dynamic_module__
 * global function to report an async module was loaded synchronously. That is useful for
 * server-side rendering of async components
 *
 * This only works if import() is found in asyncLoader() function of a UniversalAsyncComponent
 * options. We depend on function name "asyncLoader" and existence of an import() call in it.
 * @todo find a way to use the TypeScript TypeChecker instead
 *
 * @param context TypeScript Transformation context
 *
 * @example
 * input:
 * ```ts
 *  const AsyncHelloWorld = getComponentAsync({
 *    asyncLoader: () => import('path/to/hello')
 *  })
 * ```
 *
 * output:
 * ```ts
 *  const AsyncHelloWorld = getComponentAsync({
 *    asyncLoader: () => {
 *       const __module_id__ = require.resolveWeak('path/to/hello');
 *       if (__webpack_modules__ && __webpack_modules__[__module_id__]) {
 *          if (typeof global.__webpack_report_dynamic_module__ === 'function') {
 *             global.__webpack_report_dynamic_module__(__module_id__)
 *          }
 *          return __webpack_require__(__module_id__);
 *       }
 *       return import('path/to/hello')
 *    }
 *  })
 * ```
 */
export function injectSyncImportTransformFactory(context: ts.TransformationContext) {
    return function injectSyncImportTransform(sourceFile: ts.SourceFile) {
        const visited = ts.visitEachChild(sourceFile, visitor, context);
        ts.addEmitHelpers(visited, context.readEmitHelpers());

        return visited;

        function visitor(node: ts.Node) {
            if (
                kinds.isPropertyAssignment(node)
                && node.name.getText() === 'asyncLoader'
                && node.initializer
                && kinds.isArrowFunction(node.initializer)
            ) {
                // asyncLoader: () => import('...')
                if (
                    node.initializer.body
                    && kinds.isCallExpression(node.initializer.body)
                    && node.initializer.body.expression.kind === ts.SyntaxKind.ImportKeyword
                ) {
                    const moduleSpecifier = node.initializer.body.arguments[0].getText();
                    node.initializer.body = createSyncImportBlock(moduleSpecifier);
                }

                // asyncLoader: () => { return import('a') }
                // asyncLoader: () => { condition ? import('a') : import('b') } or more complex blocks
                if (kinds.isBlock(node.initializer.body)) {
                    // TODO: recursively look for "import()" calls and replace them with
                    // result of createSyncImportBlock in a IIFE
                }

                return node;
            } else {

                const visited: ts.Node = ts.visitEachChild(node, visitor, context);
                ts.addEmitHelpers(visited, context.readEmitHelpers());
                return visited;
            }
        }
    }
}


/**
 * output
 */
function createSyncImportBlock(specifier: string) {
    return ts.createBlock(
        ts_template(`
            const __module_id__ = require.resolveWeak("${specifier}");
                if (__webpack_modules__[__module_id__]) {
                    if (typeof global.__webpack_report_dynamic_module__ === 'function') {
                        global.__webpack_report_dynamic_module__(__module_id__)
                    }
                    return __webpack_require__(__module_id__);
                }
            return import("${specifier}")
        `),
        true,
    );

}

function ts_template(code: string) {
    const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.ES2015);
    return sourceFile.statements
}
