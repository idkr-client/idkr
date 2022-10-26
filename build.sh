#!/bin/sh

npm install --openssl_fips=''
#legit no1 knows if --openssl_fips down below is needed?????? if u want make pr and remove if safe?
#wow u really found this
npm run dist --openssl_fips=''