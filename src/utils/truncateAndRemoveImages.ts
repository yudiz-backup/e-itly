// export const truncateAndRemoveImages = (html, maxLength) => {
//     const description = html?.replace(/<img[^>]*>/g, "").substring(0, maxLength) || "";
//     return description + (html?.length > maxLength ? "..." : "");
// };

export const truncateAndRemoveImages = (html: string, maxLength?: number) => {

    const withoutImages = html?.replace(/<img[^>]*>/g, "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = withoutImages || "";
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const truncatedText = textContent.substring(0, maxLength);
    const result = truncatedText + (textContent.length > maxLength ? "..." : "");

    return result;
};