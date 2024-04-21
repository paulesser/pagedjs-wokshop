# HS Mainz pagedjs workshop

## Was ist pagedjs

## setup

Wir benutzen heute den vorkonfigurierten pagedjs polyfill. Du kannst pagedjs aber auch selber konfigurieren wenn du die paged.js Datei runterlädst oder das npm-Paket benutzt.
[paged documentation](https://pagedjs.org/documentation/2-getting-started-with-paged.js/#using-paged.js-as-a-polyfill-in-web-browsers)

```HTML
<script src="./paged.polyfill.js" defer></script>
```

Der polyfill schießt das HTML automatisch, nachdem er geladen wurde, aus. Dies kann verhindert werden wenn wir `PagedConfig` mit `{ auto: false }` zum [global window object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) hinzufügen.

```HTML
<script> window.PagedConfig = { auto: false };</script>
```

Um das HTML auszuschießen fügen wir ein Button zu unserem HTML hinzu:

```HTML
<button onclick="window.PagedPolyfill.preview()" class="no-print"> preview</button>
```

Wir brauchen auch die `interface.css` vom [offiziellen gitlab](https://gitlab.coko.foundation/pagedjs/interface-polyfill) um die Druckbögen korrekt zu sehen

```HTML
<link rel="stylesheet" href="./interface.css" />
```

Jetzt müsste dein HTML etwa so aussehen.

```HTML
<!DOCTYPE html>
<html lang="en">
    <head>
        <script>
            window.PagedConfig = { auto: false };
        </script>
        <script src="./paged.polyfill.js" defer></script>
        <link rel="stylesheet" href="./interface.css" />
    </head>
    <body>
        <button onclick="window.PagedPolyfill.preview()" class="no-print"> preview</button>
    </body>
</html>
```

Nun können wir loslegen.

## @page rules

Mit dem @page-CCS-Query können wir unser Dokument grundlegend einstellen.
Dabei können wir unterschiedliche Regeln für links und rechts definieren.
[Dokumentation](https://pagedjs.org/documentation/5-web-design-for-print/#%40page-rule)
[Cheat Sheet](https://pagedjs.org/documentation/cheatsheet/)

```CSS
@page:left{
    ...
}
@page:right:{
    ...
}
```

### size

In der size-Regel wird das Papierformat festgelegt. Dabei können wir gängige Formate oder mm Angaben nutzen.

```CSS
@page{
    size: 420mm 210mm;
    size: A4 landscape; //landscape falls wir nicht portrait wollen
}
```

### margin

Mit margin geben wir unseren Satzspiegel an. Die margins werden von Pagedjs später in unterschiedliche Elemente aufgeteilt, die mit [Inhalt gefüllt werden können.](https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/)

```CSS
@page:left{
  margin-top: 20mm;
  margin-bottom: 25mm;
  margin-left: 10mm;
  margin-right: 35mm;
  @top-center{
    content: 'my Book';
  }
  @bottom-left-corner{
    content: counter(page);
  }
}

```

### bleed

Bleed bezeichnet den Anschnitt. Dort benutzen wir in den meisten Fällen 3mm

```CSS
@page{
bleed: 3mm
}
```

### named pages

## pagedj-Klassen nutzen

Um Elemente links oder rechts spezifisch zu gestalten, müssen wir die page-Klassen nutzen, die pagedjs erstellt.

```CSS
.pagedjs_left_page p{
    color: blue;
}
.pagedjs_right_page p{
color: red;
}
```

## toc und counter

Um ein Inhaltsverzeichnis mit den richtigen Seitennummern zu erstellen, legen wir unser Inhaltsverzeichnis als Links an.
z.B.:

```HTML
      <ul>
        <li>
          <a href="#headline1">headline1</a>
        </li>
      </ul>
```

Dies können wir manuell oder [mit JavaScript](https://pagedjs.org/posts/build-a-table-of-contents-from-your-html/) machen.
Die Seitenzahl fügen wir dann über CSS mit einem pseudo-element ein.

```CSS
 li a::after{
    content: target-counter(attr(href), page);
}
```

CSS füllt jetzt das Element mit einem Counter der Seite die das Ziel unseres Links hat.
[CSS Counter](https://pagedjs.org/documentation/6-generated-content/#generated-counters) können wir auch für Seiten- und Zeilenzahlen oder ähnliche Nummerierungen nutzen.

## Hilfreiche CSS-Regeln

### @media print

Um websites für verschiedene Geräte zu gestalten werden [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) verwendet. Mit `@media print` können wir spezifisch für den Druck gestalten und mit `@media screen` für den Bildschirm.
Pagedjs erkennt `@media print` im CSS und setzt die Regeln um.

```CSS
@media screen{
    .no-print{
        display:none;
    }
}
```

Hier haben wir zum Beispiel eine Klasse die im Druck nicht sichtbar ist.

### break-before, break-after

Wenn wir Elemente wie Aufmacher-Seiten, die immer auf einer Seite alleine sind, haben, dann können wir festlegen das vor und/oder nach ihnen immer das Seitenlayout umgebrochen wird.

```CSS
.hero{
    break-after: page;
    break-before: page;
}
```

### columns

### floated Elemente

## Imposition plugin

[Gitlab](https://gitlab.coko.foundation/pagedjs/pagedjs-plugins/booklet-imposition)
