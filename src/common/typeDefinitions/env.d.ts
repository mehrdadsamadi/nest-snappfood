declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    PORT: string;

    // Database
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    // s3
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT: string;
  }
}
