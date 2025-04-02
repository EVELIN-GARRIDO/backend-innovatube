class Video {
    constructor(id, title, channelTitle, link, thumbnail, isFavorite = false, isShared = false) {
        this.id = id;
        this.title = title;
        this.channelTitle = channelTitle;
        this.link = link;
        this.thumbnail = thumbnail;
        this.isFavorite = isFavorite;
        this.isShared = isShared;
    }
}

export default Video;
