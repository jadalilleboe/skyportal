from ..base import BaseHandler
from baselayer.app.access import permissions, auth_or_token
import numpy as np
from astropy.coordinates import SkyCoord
import astropy.units as u
import dl

class DatalabQueryHandler(BaseHandler):
    @auth_or_token
    def post():
        return 0
        