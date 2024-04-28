import RollupConfig from '../rollup.config.js'
import path from "path";
import { processDtsFiles, __dirname } from "./proccess-types-files.js";

Promise.all(RollupConfig.map(config => {
    return processDtsFiles(`./${config.output.file.split('/')[0]}/types`, (content, filePath) => {

        const distFolder = path.resolve(__dirname, `./${config.output.file.split('/')[0]}/types`)
        const resolveFilePath = path.resolve(distFolder, '../..', filePath)

        const distRelativeResolve = `${path.relative(resolveFilePath, distFolder).replace("..", '').replace("\\", '').replaceAll('\\', '/') || '.'}/`

        return content.replaceAll("'@/", `'${distRelativeResolve}`).replaceAll('"@/', `"${distRelativeResolve}`)
    })
}))