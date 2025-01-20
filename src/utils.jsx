export function getProfilePhotoUrl(photo) {
    if (!photo) return '/src/assets/images/default_profile.png'; // 기본 이미지

    const photoParts = photo.split("/"); // URL 파싱
    console.log(photoParts)
    if (photoParts[0] === "items") {
        return `https://cdn.fastly.steamstatic.com/steamcommunity/public/images/${photoParts.join("/")}`;
    } else if (photoParts[0] === "https%3A") {
        return decodeURIComponent(photoParts.join("/"));
    } else if (photoParts[2] == "images" && photoParts[3] == "profile") {
        return `${import.meta.env.VITE_BACKEND_URL}${photo}`
    } else {
        return photo;
    }
}
