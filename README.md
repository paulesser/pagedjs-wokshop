# HS Mainz pagedjs workshop

## Was ist pagedjs

### CSS Erweiterung
Pagedjs setzt unter anderem den [CSS Generated Content for Paged Media Module Draft](https://www.w3.org/TR/css-gcpm-3/) um, der bisher noch von keinem Browser unterstützt wird.
Dadurch können wir hilfreiche CSS Regeln benutzen, die der Browser normalerweise ignorieren würde. Ohne diese Regeln ist die Gestaltung von Print Dokumenten noch sehr begrenzt.

### Druckvorschau
Um diese und weitere Regeln umzusetzen simuliert pagedjs eine Druckvorschau, bei der unsere Webseite
gechunkt wird und in Doppelseiten ausgeworfen wird. Das hilft uns dabei effizienter zu arbeiten, da
die native Druckvorschau der Browser meistens sehr simpel ist. Dazu können wir auch DevTools benutzen
um direkt im Browser Änderungen durchzuführen.

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

Mit dem @page-CCS-Query können wir unser Dokument grundlegend einstellen. Diese funktioniert in etwa
wie Masterseiten in InDesign.

### size

In der size-Regel wird das Papierformat festgelegt. Dabei können wir gängige Formate oder mm Angaben nutzen.
_Die size rule kann nur einmal im @page query festgelegt werden._

```CSS
@page {
    size: 420mm 210mm;
    size: A4 landscape; /*landscape falls wir nicht portrait wollen*/
}
```

### margin

Mit margin geben wir unseren Satzspiegel an. Die margins werden von Pagedjs später in unterschiedliche Elemente aufgeteilt, die mit [Inhalt gefüllt werden können.](https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/)

```CSS
@page {
  margin-top: 20mm;
  margin-bottom: 25mm;
  margin-left: 10mm;
  margin-right: 35mm;
  /* oder kurz: */
  /* margin: 20mm 35mm 25mm 10mm;*/  
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
bleed: 3mm;
}
```
## Spezifische Seiten ansprechen

Um Seiten spezifisch zu gestalten gibt es zwei verschiedene Arten diese Anzusprechen. Einmal generell
mit den Page Selektoren und einmal mit benannten Seiten.

_Hier können alle @page regeln verwendet werden, außer size und bleed. Diese können nur einmal im
generellen @page query festgelegt werden!_

### page Selektoren
Um spezifische Seiten zu stylen gibt es folgende CSS page Selektoren
- :first (für die erste Seite)
- :blank (für alle Seiten ohne Inhalt)
- :right (alle ungeraden Seiten; alle rechten Seiten)
- :left (alle geraden Seiten; alle linken Seiten)

[Dokumentation](https://pagedjs.org/documentation/5-web-design-for-print/#%40page-rule)
[Cheat Sheet](https://pagedjs.org/documentation/cheatsheet/)

Diese werden folgendermaßen eingesetzt:

```CSS
@page:left {
    /*...*/
}
@page:right {
    /*...*/
}
@page:blank {
    /*...*/
}
@page:first {
    /*...*/
}
```
So können wir zum Beispiel den Satz spiegel für links und rechts seperat einstellen, damit der Abstand
zum Bund und zur Außenkante rechts und links gleich ist.

### named pages
Mit named pages können wir z.B. verschiedene Kapitel in unserem Dokument anders stylen. Dafür geben
wir im Container/Wrapper des Kapitels an, wie diese heißen soll:

```CSS
div.chapter-introduction {
    page: Introduction;
}
```
Jede Seite auf der unser Container/Wrapper enthalten ist, kann nun seperat gestyled werden:

```CSS
@page Introduction {
    background: red;
}
```
Auch hier können wir mit den page Selektoren arbeiten:
```CSS
@page Introduction:first {
    margin: 0;
}
```

## pagedjs-Klassen nutzen

Pagedjs gibt dem page layout einige Klassen. Diese können wir benutzen um Elemente die sich auf bestimmten Seiten befinden zu stylen.
Diese könnt ihr am besten mit dem Inspect Tool im Browser ansehen.

Um Elemente links oder rechts spezifisch zu gestalten, müssen wir die page-Klassen nutzen, die pagedjs erstellt.

```CSS
.pagedjs_left_page p{
    color: blue;
}
.pagedjs_right_page p{
    color: red;
}
```

## Generated Content

### Content property
Die CSS content Eigenschaft kann benutzt werden um festzulegen was der Inhalt eines Elements sein soll.
Das können Text, Bilder, Farbverläufe, HTML attribute, etc. sein. [Hier](https://developer.mozilla.org/en-US/docs/Web/CSS/content#syntax) 
ist eine kleine Übersicht.

pagedjs erlaubt es uns die Margin Boxen, welche wir am Anfang gesehen haben mit der content Eigenschaft zu befüllen:
```CSS
@page:left {
    @bottom-center {
        content: "Mein Kolumnentitel"
    }
}
```

Nachfolgen schauen wir uns ein paar interessante Inhalte an, die als content eingesetzt werden können.
### Counter
[CSS Counter](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters) kennt ihr vielleicht von OL Elementen.
Theoretisch sind counter nur eine Variable (Zahl) die als content benutzt werden kann.
Diese funktionieren mit zwei CSS Befehlen:

#### Counter Increment
Wir legen fest welche Elemente den Counter erhöhen sollen. Dafür geben wir den Namen des Counters an.
Als Beispiel bieten sich Fußnoten an.
```CSS
.footnote {
    counter-increment: footnote;
}
```
#### Counter Reset
Mit dem counter-reset legen wir fest, welches Element den Counter zurücksetzt. In unserem Beispiel
macht es Sinn den Fußnoten Counter bei jeder neuen Artikel überschrift zurückzusetzen, damit wir wieder
bei 1 starten.

```CSS
h1 {
    counter-reset: footnote;
    /* es ist auch möglich diesen auf eine spezifische Zahl zurückzusetzen */
    counter-reset: footnote 4;
}
```

#### Darstellung
Um den Counter anzuzeigen müssen wir ihn nur als content darstellen (hier z.B. vor der Fußnote):
```CSS
.footnote::before {
    content: counter(footnote);
}
```

### Paged Media Counters
Der Browser erstellt automatisch beim Druck einer Webseite folgende Counter:
- page (die aktuelle Seitenzahl)
- pages (die Gesamtanzahl der Seiten)

Damit können wir Seitenzahlen in unsere Margin Boxen einfügen:
```CSS
@page:left {
    @bottom-left-corner {
        content: counter(page) /* Hier würde das dann auf Seite 2 so aussehen: 2 */
        content: counter(page) "/" counter(pages) /* Seite 2 (bei insgesamt 22 Seiten): 2/22 */
        /* Man kann der content Eigenschaft auch mehrere Inhalte geben und diese einfach
         nur durch ein Leerzeichen trennen, siehe oben. Diese werden dann hintereinander 
         dargestellt.*/
    }
}
```

### Kolumnentitel
Als letztes schauen wir uns noch an wie wir z.B. Titel von Artikeln in unsere Margin Boxen bekommen.
Dafür brauchen wir die string-set Eigenschaft. Diese funktioniert wie eine Variable, die Text speichern kann.
Wie beim Counter geben wir an welches Element Einfluss auf diese hat. Wir können zum Beispiel den Textinhalt einer Überschrift
als string-set speichern:

```CSS
h1 {
    string-set: articleTitle content(text);
    /* Wir geben erst den Namen unserer Variable an (hier: articleTitle) und dann den Inhalt */
    /* Die variablen müssen nicht initiiert werden, sobald der Name auftaucht existiert diese als solche */
}
```

Und dann den Titel in unseren Margin Boxen darstellen:
```CSS
@page {
    @bottom-center {
        content: string(articleTitle);
    }
}
```
Sollten auf unserer Seite mehrere h1 Elemente auftauchen können wir angeben welchen der Titel wir benutzen wollen:
- first
- last
- start

Wir wollen zum Beispiel immer den ersten Titel auf der Seite benutzen:
```CSS
@page {
    @bottom-center {
        content: string(articleTitle, first);
    }
}
```

Hier gibt es noch einige andere Möglichkeiten, da hilft auch die [pagedjs Doku.](https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/)

### TOC
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

- [break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after?retiredLocale=de)
- [break-before](https://developer.mozilla.org/en-US/docs/Web/CSS/break-before)

### columns

Wir können die [CSS-Columns-Regel](https://developer.mozilla.org/en-US/docs/Web/CSS/columns) nutzen wenn wir Text in mehrspaltigen Layouts laufen lassen wollen. Mit CSS Grid kann pagedjs nicht umgehen.

```CSS
.multi-column{
    columns: 2 100mm; //shorthand
    column-count: 2;
    column-width: 100mm
}
```

Um spalten umzubrechen können wir `break-after` und `break-before` mit `column` nutzen.

### floated Elemente

## Imposition plugin

[Gitlab](https://gitlab.coko.foundation/pagedjs/pagedjs-plugins/booklet-imposition)
