# peroxide
#### A simple, configurable proxy server that will hit a chain of sources before failing.

A common problem when working in a dev environment with production data is that some assets will need to point to local files and others will need to point to production servers (depending on the environment they were created in). Managing this within the application can be infeasible – that's where peroxide comes in.

*Attempt to serve files locally, then fall back to staging or production sources.*

```sh
$ npm install -g peroxide
$ peroxide --port=8000 --config=./sources.json
```

## Configuration

Peroxide uses a JSON configuration file (that is loaded via the `--config` flag). Each entry makes up a zone with an associated [responder](#responders) and list of sources (which can be served from the [filesystem](#filesystem) or a [http](#http) source).

```json
{
   "/assets": {
      "responder": "pipe",
      "sources": [
         {"type": "filesystem", "options": {"path": "/var/www/site.com/public/"}},
         {"type": "http", "options": {"path": "http://s3.amazonaws.com/static.site.com"}}
      ]
   },
   "/ugc": {
      "responder": "pipe",
      "sources": [
         {"type": "filesystem", "options": {"path": "/var/www/site.com/public/ugc"}},
         {"type": "http", "options": {"path": "http://s3.amazonaws.com/ugc.site.com"}},
         {"type": "http", "options": {"path": "http://s3.amazonaws.com/ugc.site.com"}}
      ]
   }
}
```

With the above configuration, you can request files like:

```
http://localhost:8000/assets?path=/images/1/icon.png
http://localhost:8000/ugc?path=/avatars/5_64x64.png
```

The format follows (`path` is relative to each source):
```
http://localhost:[port]/[zone]?path=[path]
```

### Sources
- **"http"** – Attempts to fetch the asset over HTTP (options: *path*).
- **"filesystem"** – Reads from the filesystem (options: *path*).

### Responders
- **"pipe"** – Pipes the readable stream straight to the response.

## Debugging

Peroxide adds a `X-Content-Source` response header that makes it possible to tell where the file came from:

```
X-Content-Source: https://s3.amazonaws.com/static.site.com/images/icon.png
```

If no source is able to serve the file, a `404 Not Found` status will be provided. The body will be a `text/plain` description containing all the paths that were attempted.


## License

Copyright &copy; 2013 – [Creative Market](https://creativemarket.com)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.