import { getPath } from "#lib/utils";

const serverConfig = (env) =>  ({
    logDir  : env.LOG_DIR || "storage/log",
    tempDir : getPath(env.TEMP_DIR || "storage/tmp"),
    mediaUploadDir    : getPath(env.MEDIA_UPLOAD_DIR || "storage/local/media"),
    maxFileUploadSize : Number(env.MAX_FILE_UPLOAD_SIZE) || 1000,
    maxClusterWorkers : Number(env.MAX_CLUSTER_WORKERS),
});

export default serverConfig;