### Función en "detail.js" para evitar casos como arraySkus = ['71401Z75991%GC', '71401Z75991%G']. Si se ingresa primero el mas largo, en algun momento, dado el mecanismo del scanner de skus, el codigo que en principio seria esto => 71401Z75991%GC, primero va a ser esto => 71401Z75991%G, lo cual nos plantea un problema ya que de no haber recibido el producto 71401Z75991%G, de todos modos se marcaría como producto ingresado.


```javascript
	 let timeout; // Variable para almacenar el temporizador

      skuEnter.addEventListener('input', (e) => {
        clearTimeout(timeout); // Limpiamos el temporizador previo si existe. Por las dudas que el scanner falle y entre caracter y caracter hayamas de 50ms

        // Definir un pequeño retraso (por ejemplo, 50ms) para procesar el valor del input
        timeout = setTimeout(() => {
          let text = e.target.value.trim();

          // Solo procesar si la longitud es 13 o 14
          if (text.length === 13 || text.length === 14) {
            skus.forEach((sku) => {
              if (sku === text) {
                const itemOk = document.getElementsByClassName(text);
                for (let i = 0; i < itemOk.length; i++) {
                  itemOk[i].classList.add('cell-ok');
                  itemOk[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                  });
                }

                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }, 1000);
              }
            });

            // Limpiar el campo de texto después de 300ms
            setTimeout(() => {
              e.target.value = '';
            }, 300);
          }
        }, 50); // Ajusta este valor según la velocidad del escáner
      });

 ```


clearTimeout es un método nativo de JavaScript. Su función es cancelar o detener un temporizador que haya sido iniciado previamente con setTimeout

## Funcionamiento de setTimeout

Cuando usas setTimeout, estás diciendo al navegador que ejecute una función después de un tiempo determinado.

```javascript
const timeoutId = setTimeout(() => {
    console.log("Esto se ejecuta después de 2 segundos");
}, 2000);
```

Aquí, el setTimeout devuelve un ID (timeoutId), que es un número único que identifica ese temporizador. Si el temporizador no se cancela, después de 2 segundos la función será ejecutada.

## Funcionamiento de clearTimeout
clearTimeout toma el ID del temporizador generado por setTimeout y lo cancela, lo que significa que la función no será ejecutada aunque el tiempo haya pasado

```javascript
clearTimeout(timeoutId); // Cancela el temporizador
```
## Ejemplo paso a paso
- Llamas a setTimeout, que inicia un temporizador y devuelve un ID.
- Si antes de que el tiempo expire llamas a clearTimeout con el mismo ID, el temporizador se cancela y la función no se ejecuta.

## Cómo se aplica a este codigo

Aquí la lógica de clearTimeout(timeout); es reiniciar el temporizador si llega otro carácter antes de que expire el tiempo:

```javascript
skuEnter.addEventListener('input', (e) => {
    clearTimeout(timeout); // Detiene el temporizador anterior si hay uno
    timeout = setTimeout(() => {
        // Lógica que se ejecuta una vez pasados los 50ms sin más entradas
        let text = e.target.value;
        // Procesar el input
    }, 50);
});
```

## Detalle del proceso:

- Cada vez que un carácter se ingresa, se llama a clearTimeout para detener el temporizador anterior.
- Luego se inicia un nuevo temporizador con setTimeout.
- Si el usuario no ingresa nada más en los próximos 50 ms, el temporizador finalizará y ejecutará la función.
- Si el usuario o escáner ingresa otro carácter antes de los 50 ms, el temporizador anterior es cancelado y se crea uno nuevo.
  
Este comportamiento asegura que solo proceses el input cuando la entrada de caracteres haya terminado.

## Resumen de cómo funciona

- <mark>setTimeout</mark>: Ejecuta una función después de un tiempo específico.
- <mark>clearTimeout</mark>: Cancela el temporizador antes de que finalice, evitando que la función se ejecute.
- En este caso, <mark>clearTimeout</mark> evita que se procese el input hasta que se hayan ingresado todos los caracteres y no haya nuevas entradas en un breve periodo de tiempo.