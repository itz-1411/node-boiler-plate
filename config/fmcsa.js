const fmcsaConfig = (env) =>  ({
    debug             : Boolean(env.FMCSA_DEBUG)               || true,
    ELDRegistrationId : env.FMCSA_ELD_REGISTRATION_ID          || 'TEST',
    ELDIdentifier     : env.FMCSA_ELD_IDENTIFIER               || 'TESTXX',
    dotInspectionDir  : env.FMCSA_DOT_INSPECTION_DIR           || 'storage/local/dot-inspection',
    dotInspectionFileName   : env.FMCSA_DOT_INSPECTION_FILE_NAME || 'dot-inspection-[driver]-[time].csv',
    webServiceTarget        : env.FMCSA_WEBSERVICE_WEBSERVICE_TARGET || 'https://eldws.fmcsa.dot.gov/ELDSubmissionService.svc',
    webServiceCrtPath       : env.FMCSA_WEBSERVICE_CRT_PATH          || 'storage/ssl/fmcsa/secret.crt',
    webServiceCrtKeyPath    : env.FMCSA_WEBSERVICE_CRT_KEY_PATH      || 'storage/ssl/fmcsa/secret.key',
    webServiceCrtPemPath    : env.FMCSA_WEBSERVICE_CRT_PEM_PATH      || 'storage/ssl/fmcsa/secret.pem',
    webServiceCrtPassphrase : env.FMCSA_WEBSERVICE_CRT_PASSPHRASE    || 'hackme',
})

export default fmcsaConfig;