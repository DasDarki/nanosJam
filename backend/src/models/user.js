class User {
    constructor(id, username, avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }

    get avatarUrl() {
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}`;
    }
}

module.exports = User;
