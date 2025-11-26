class Config:
    SECRET_KEY = '1ts_a_S3cret!'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'An0th3r_S3cret!'