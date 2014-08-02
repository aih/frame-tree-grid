import os.path

class Config(object):
    DEBUG = False
    TESTING = False
    PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
    VERSION = '0.0.0'

class ProductionConfig(Config):
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

