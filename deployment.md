

## Back-end deployment 
1. Run the github `build` action
2. run the script `./root/prj/serverpal/start.sh start`

- if the script is not executable run `chmod +x /root/prj/serverpal/start.sh`


## Front-end deployment 
1. locally run `ng build`
2. locally enter the `dist` directory 
3. locally run `rsync --progress -a * root@149.28.47.219:/root/prj/grocerypal/`
4. on server run `cd /root/prj/grocerypal`
3. on server run `pm2 start "lite-server --baseDir=\"./grocerypal/\"" --name front-end`

- check services with `pm2 status`
- check if the front end is running at <http://149.28.47.219:3000/>
