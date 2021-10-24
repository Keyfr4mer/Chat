Yeet messenger

Is verry nice project, yes.
Verry secure as well, yes yes.

No BND or FBI knocking at ur dor anyomore, verry nice

Setup:
1. Linux environment is needed because of gunicorn server
2. install requirements.txt in python env
3. go into socketio_test dir and run:
  gunicorn -k eventlet -w 1 --reload --bind 127.0.0.1 app:app
