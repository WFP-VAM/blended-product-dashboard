# from rio_tiler.io import Reader
import xarray as xr
import rioxarray as rxr
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rio_tiler.profiles import img_profiles
# from rio_tiler.colormap import cmap
import logging
import uvicorn
import os
from shapely.geometry import Polygon
from utils.cache import memoize_with_persistence
log = logging.Logger('log')
log.setLevel(logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

DATASET = "https://data.earthobservation.vam.wfp.org/public-share/long_term_blending/MOZ/chirp_daily_blended_corrected_dek_timesteps.zarr"
ds = xr.open_zarr(DATASET)
ds.rio.write_crs("EPSG:4326", inplace=True)


@app.get(
    r"/{z}/{x}/{y}.png",
    responses={
        200: {
            "content": {"image/png": {}}, "description": "Return an image.",
        }
    },
    response_class=Response,
    description="Read COG and return a tile",
)
def tile(
    z: int,
    x: int,
    y: int,
    dataset: str,
    color: str = 'ylorrd',
    max_val: int = 10000,
    unscale: bool = True
):
    """Handle tile requests."""
    dataset = f'{GCS_BASE}/{dataset}'
    cm = cmap.get(color)
    options={"unscale":unscale}
    with Reader(dataset, options=options) as cog:
        # print(cog.info())
        img = cog.tile(x, y, z)
    img.rescale(
        in_range=((0, max_val),),
        out_range=((0, 255),)
    )
    content = img.render(img_format="PNG", colormap=cm, **img_profiles.get("png"))
    # print(img.data)
    # return 200
    return Response(content, media_type="image/png")


class Geometry(BaseModel):
    type: str
    coordinates: list
    box: dict
    stat: str
    params: dict


def exceedance(ds, threshold, streak):
    intermediate = xr.where(ds > threshold, 1, np.nan).rolling(time=streak).sum()
    return intermediate.where(intermediate > 0)

function_mapping = {
    "EXCEEDANCE": exceedance
}

@memoize_with_persistence('/tmp/cache.pkl')
def clip_box_with_persistence(**kwargs):
    return ds.rio.clip_box(
        **kwargs
    )


@app.post("/raster/stats/")
def raster_stats(
    geometry: Geometry
):
    log.warning(geometry.box)
    box = geometry.box
    x = clip_box_with_persistence(
        minx=box["_sw"]["lng"],
        miny=box["_sw"]["lat"],
        maxx=box["_ne"]["lng"],
        maxy=box["_ne"]["lat"],
        auto_expand=True
    )
    polygon = Polygon(geometry.coordinates[0])
    x = x.rio.clip([polygon], all_touched=True)
    x = function_mapping[geometry.stat](x, **geometry.params)
    log.warning(x.compute().values())
    return 200


@app.get('/')
def test():
    log.warning(ds)
    return 'OK'

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True) 
