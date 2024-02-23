FROM condaforge/mambaforge:23.3.1-1 as conda

# ENV LD_PRELOAD /opt/conda/lib/python3.10/site-packages/sklearn/utils/../../../../libgomp.so.1
WORKDIR /app
COPY ./requirements.txt .
COPY ./app.py ./app.py
RUN mamba install --yes --file requirements.txt

ENTRYPOINT ["uvicorn", "app:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]