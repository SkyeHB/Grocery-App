 if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
            pm2 restart "$APP_NAME" --update-env
        else
            pm2 start index.js --name "$APP_NAME"
        fi
        ;;

    stop)
        if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
            pm2 stop "$APP_NAME"
        else
            echo "Error: PM2 process '$APP_NAME' was not found."
            exit 1
        fi
        ;;

    *)
        show_usage
        exit 2
        ;;
esac
