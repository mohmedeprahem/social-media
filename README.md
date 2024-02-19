# Social Media API

## Description

This project is a Social Media API built using NestJS, providing essential functionalities for a social networking platform.

**Technologies**: NestJS, TypeScript, PostgreSQL and JWT.

## Feature

- **User Authentication**: Secure user authentication mechanisms.
- **Profile Management**: APIs for managing user profiles, including personal information.
- **Friend Connections**: Enable users to establish connections with other users.
- **Post Creation and Interaction**: APIs to support creating posts, liking, commenting, and sharing posts among users.
- **Privacy Controls**: Basic privacy settings to manage the visibility of user content and interactions.

## Documentation

- Deployed on RailWay [here](https://social-media-production-cfb7.up.railway.app/api#/)
- System Design [here](https://docs.google.com/document/d/1OZB2dP51GcvhMvAlpoQlGYUSN_Z4Ol_4b0mAq9nHrps/edit?usp=sharing)

## Getting Started

1. **Installation**: Clone the repository and install dependencies.

```bash
git clone https://github.com/mohmedeprahem/social-media.git
cd social-media
npm install
```

2. **Configuration**: Set up environment variables and configure the database connection in the `.env` file.

```plaintext
DB_HOST=your database host
DB_PORT=your database port
DB_USER=your database username
DB_PASS=your database password
DB_NAME= Your database name
NODE_ENV=development
SWAGGER_TITLE=any title
SWAGGER_DESCRIPTION=write description
MAIL_HOST=type of mail like smtp.gmail.com
MAIL_USER= your email
MAIL_PASS= the password of mail service
JWT_AT_SECRET=Your jwt access secret key
JWT_RT_SECRET= Your jwt refresh secret key
JWT_AT_EXPIRES_IN=example '30m'
JWT_RT_EXPIRES_IN=example '10d'
PORT=3000
```

3. **Running the Application**: Start the NestJS application.

```bash
npm run start
```

4. **Contribution**: Contributions are welcome! If you find any issues or would like to add new features, feel free to open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Thanks to the NestJS team for providing an excellent framework for building web applications.
- Special thanks to the contributors of libraries and tools used in this project.
