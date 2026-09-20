self.__uv$config = {
    prefix: '/a/',
    // Bare server endpoint. '/o/' only works on a host that runs index.js.
    // On static hosts (Netlify etc.) set this to the absolute https:// URL
    // of your bare server, e.g. 'https://bare.example.com/o/'.
    bare: '/o/',
    encodeUrl:  Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/m/handler.js?v=4',
    bundle: '/m/bundle.js?v=4',
    config: '/m/config.js?v=4',
    sw: '/m/sw.js?v=4',
};