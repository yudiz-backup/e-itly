declare global {
    interface Window { tinymce: any; }
}

window.tinymce = any

type UnknownObject = {
    [key: string]: any;
}