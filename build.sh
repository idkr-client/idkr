#!/bin/sh

npm install --openssl_fips=''
#legit no1 knows if --openssl_fips down below is needed?????? if u want make pr and remove if safe?
npm run dist --openssl_fips=''