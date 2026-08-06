import logging

# set up the logger
def setup_logging(level: int):
    # create the configuration
    logging.basicConfig(format="(%(asctime)s) [%(levelname)s] %(message)s", datefmt="%m/%d/%Y at %H:%M:%S", level=level)

    # log log level
    log_level_name = logging.getLevelName(level)
    logging.info(f"Logger set up. Log level set to: {log_level_name}")