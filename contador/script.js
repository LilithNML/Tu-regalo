document.addEventListener('DOMContentLoaded', function() {
    // La fecha en que se hicieron novios: 9 de noviembre de 2024
    // Formato: new Date(año, mes-1, día, horas, minutos, segundos)
    const startDate = new Date(2024, 10, 9, 0, 0, 0); // Meses son 0-indexados, así que Noviembre es 10

    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const yearsBlock = document.getElementById('years-block');

    function updateCountdown() {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime(); // Diferencia en milisegundos

        // Convertir milisegundos a unidades de tiempo
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Calcular años y meses de forma más precisa
        let years = 0;
        let months = 0;
        let remainingDays = days;

        if (diff > 0) { // Solo si la fecha inicial ya pasó
            let currentYear = startDate.getFullYear();
            let currentMonth = startDate.getMonth();
            let currentDay = startDate.getDate();
            let currentHour = startDate.getHours();
            let currentMinute = startDate.getMinutes();
            let currentSecond = startDate.getSeconds();

            while (true) {
                let nextMonth = currentMonth + 1;
                let nextYear = currentYear;
                if (nextMonth > 11) {
                    nextMonth = 0;
                    nextYear++;
                }

                // Crear una fecha para el inicio del siguiente mes relativo a la fecha de inicio
                let nextDate = new Date(nextYear, nextMonth, currentDay, currentHour, currentMinute, currentSecond);
                
                // Asegurarse de que el día sea válido para el siguiente mes (ej. 31 de feb)
                if (nextDate.getMonth() !== nextMonth) {
                    nextDate = new Date(nextYear, nextMonth, 0, currentHour, currentMinute, currentSecond); // Último día del mes anterior
                }


                if (nextDate.getTime() <= now.getTime()) {
                    // Si el siguiente mes ya pasó, lo contamos
                    months++;
                    currentYear = nextYear;
                    currentMonth = nextMonth;
                } else {
                    break; // El siguiente mes aún no ha llegado
                }
            }

            years = Math.floor(months / 12);
            months = months % 12;

            // Calcular los días restantes después de restar años y meses completos
            let dateAfterMonthsYears = new Date(startDate);
            dateAfterMonthsYears.setFullYear(startDate.getFullYear() + years);
            dateAfterMonthsYears.setMonth(startDate.getMonth() + months);

            // Ajustar el día si es necesario para evitar desbordamientos de mes
            if (dateAfterMonthsYears.getDate() !== startDate.getDate()) {
                dateAfterMonthsYears = new Date(startDate.getFullYear() + years, startDate.getMonth() + months + 1, 0, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
            }

            remainingDays = Math.floor((now.getTime() - dateAfterMonthsYears.getTime()) / (1000 * 60 * 60 * 24));
            if (remainingDays < 0) { // Si el ajuste de fecha nos llevó un poco más allá, corregimos
                remainingDays = 0;
            }
        }


        // Mostrar años solo si es necesario
        if (years > 0) {
            yearsBlock.style.display = 'block';
            yearsElement.textContent = years;
        } else {
            yearsBlock.style.display = 'none';
        }

        monthsElement.textContent = months;
        daysElement.textContent = remainingDays;
        hoursElement.textContent = hours % 24;
        minutesElement.textContent = minutes % 60;
        secondsElement.textContent = seconds % 60;
    }

    // Actualizar el contador cada segundo
    setInterval(updateCountdown, 1000);

    // Llamar a la función al cargar la página para que se muestre inmediatamente
    updateCountdown();
});
