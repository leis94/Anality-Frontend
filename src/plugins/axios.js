"use strict";

import axios from "axios";

const host = (process.env.VUE_APP_MODE != 'devp') ? window.location.host : 'localhost:8000'

const config = {
  baseURL: `${window.location.protocol}//${host}/`,
};

const _axios = axios.create(config);

const http = _axios

export default http;