import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("heavy_metal_api:app", host="0.0.0.0", port=port) 