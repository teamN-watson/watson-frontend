export function getProfilePhotoUrl(photo) {
    if (!photo) return '/src/assets/images/default_profile.png'; // 기본 이미지

    const photoParts = photo.replace("/media/", "").split("/"); // URL 파싱
    console.log(photoParts)
    if (photoParts[0] === "items") {
        return `https://cdn.fastly.steamstatic.com/steamcommunity/public/images/${photoParts.join("/")}`;
    } else if (photoParts[0] === "https%3A") {
        return decodeURIComponent(photoParts.join("/"));
    } else if (photoParts[0] == "images" && photoParts[1] == "profile") {
        return `${import.meta.env.VITE_BACKEND_URL}${photo}`
    } else {
        return photo;
    }
}

export function dateformat(date){
    if(date == undefined){ return ""}
    // 날짜 문자열을 파싱하여 "날짜" 객체로 변환
    const parts = date.split(" "); // ['9', 'Dec,', '2020']
    const day = parts[0];
    const month = parts[1].replace(",", ""); // 'Dec'
    const year = parts[2];

    // 월을 숫자로 변환
    const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
    };

    return `${year}-${monthMap[month]}-${day}`
}