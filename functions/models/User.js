class User {
    constructor(id, first_name, last_name, username, email, password_hash, created_at = new Date()) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.created_at = created_at;
    }
}

export default User;
