function getImgUrl (item) {
    var imgSrc = item.pic.split('/')
    return ('/' + imgSrc[1] + '/' + imgSrc[2])
}

var util = {
    getImgUrl
}

export default util
