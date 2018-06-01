#!/usr/bin/env bash
GREEN='\033[0;32m'
RED='\033[0;33m'
NC='\033[0m' # No Color

set -x

dist_server_location="~/ethernalMessage";
dist_local_location="./dist";

BUILD_ARTIFACT="ethernalMessage:latest.tar.gz"

if [ -z "$ETHERNAL_SERVER" ]; then
    echo -e "$RED You have to set variable 'ETHERGUN_SERVER'$NC"
    ETHERGUN_SERVER="165.227.24.155"
    echo -e "$RED Trying to use default server $ETHERGUN_SERVER $NC"
fi

if ssh "centos@$ETHERGUN_SERVER" "echo connection-test"; then
  echo -e "$GREEN Connection to $ETHERGUN_SERVER OK. Proceeding. $NC"
else
  exit -1;
fi;

echo -e "$GREEN Deleting the old dist locally.$NC"
rm -r "$dist_local_location" ||:

echo -e "$GREEN Building new dist.$NC"
yarn bundle:dev

echo -e "$GREEN Packaging deployment artifact.$NC"
tar -cvzf "$BUILD_ARTIFACT" "./dist"

echo -e "$GREEN Deleting the old deployment files from the server.$NC"
ssh "centos@$ETHERGUN_SERVER" "mkdir -p $dist_server_location; rm -r $dist_server_location/*"

echo -e "$GREEN Copying new deploy artifact to the server.$NC"
scp "./$BUILD_ARTIFACT" "centos@$ETHERGUN_SERVER:~/ethernalMessage"

echo -e "$GREEN Extracting deploy artifact on the server.$NC"
ssh "centos@$ETHERGUN_SERVER" "(cd $dist_server_location; gunzip -c ${BUILD_ARTIFACT} | tar xopf -)"

echo -e "$GREEN Creating directory ./logs in project directory on server.$NC"
ssh "centos@$ETHERGUN_SERVER" "(mkdir -p $dist_server_location/logs;)"

echo -e "$GREEN Writing information about this deploy on server.$NC"
ssh "centos@$ETHERGUN_SERVER" "(cd $dist_server_location; echo \"`whoami` `date` \" > last_deploy.txt )"
