import fs  from 'fs';
import Log from  '#lib/logger'


export const write = async (name, content, async = false) => {
    Log.debug(`writing file ${name} with -> ${content}`);

    if(async === false){
        return fs.writeFileSync(name, content);
    }
    fs.writeFile(name, content, async);
}

export default { write }
