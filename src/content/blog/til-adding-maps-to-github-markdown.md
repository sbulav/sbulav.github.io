---
title: "TIL - Adding maps to Github markdown files/blog posts"
date: 2022-06-29
categories:
  - TIL
tags:
  - github
---

Today I learned that you can embed maps in geoJSON and topoJSON format into
your markdown files.

For example, you can select desired area in the [geojson.io](https://geojson.io/),
copy the code and embed it like this:

```geojson
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              33.3845329284668,
              35.318837042777545
            ],
            [
              33.39577674865723,
              35.318837042777545
            ],
            [
              33.39577674865723,
              35.32450954444298
            ],
            [
              33.3845329284668,
              35.32450954444298
            ],
            [
              33.3845329284668,
              35.318837042777545
            ]
          ]
        ]
      }
    }
  ]
}
```

This snippet will be rendered automatically in your markdown files.

To paste this in GitHub Pages, use following link:
```text
<script src="https://embed.github.com/view/geojson/<username>/<repo>/<ref>/<path_to_file>"></script>
```

<script src="https://embed.github.com/view/geojson/sbulav/test-geo-map/main/test-map.geojson"></script>

For more information, check out documentation:
- [Mapping geoJSON files on GitHub](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#mapping-geojson-files-on-github)
- [Creating geoJSON and topoJSON maps](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-geojson-and-topojson-maps)