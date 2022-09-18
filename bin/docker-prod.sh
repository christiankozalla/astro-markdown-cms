docker run -dp 3000:3000 \
  --mount type=bind,source="$(pwd)"/data,target=/app/data \
  michaels-blog-prod
 
