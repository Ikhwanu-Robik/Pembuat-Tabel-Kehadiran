class TableFormatConverter {
  dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  filterValidDays(arr) {
    const days = Array.from(
      document.querySelectorAll("input[type=checkbox]:checked")
    ).map((cb) => cb.value);

    if (!days.length) {
      return [];
    }

    // Create a regex to match if the string starts with one of the day names
    const pattern = new RegExp(`^(${days.join("|")})\\b`, "i");

    // Filter array
    return arr.filter((str) => pattern.test(str.trim()));
  }

  splitDateTime(arr) {
    return arr.map((str) => {
      // Split into parts
      const [day, rest] = str.split(", ");

      const parts = rest.split(" ");

      const date = parseInt(parts[0]);
      const month = parts[1];
      const year = parseInt(parts[2]);
      const endHour = parts[3];

      return { day, date, month, year, endHour };
    });
  }

  randomizeTime(timeStr) {
    // Parse hour and minute
    let [hour, minute] = timeStr.split(":").map(Number);

    // Randomly decide whether to add (+1) or subtract (-1)
    const direction = Math.random() < 0.5 ? -1 : 1;

    // Random number of minutes between 1 and 10
    const delta = Math.floor(Math.random() * 10) + 1;

    // Apply change
    let newMinute = minute + direction * delta;

    // Adjust hour and minute if needed
    if (newMinute >= 60) {
      newMinute -= 60;
      hour = (hour + 1) % 24;
    } else if (newMinute < 0) {
      newMinute += 60;
      hour = (hour - 1 + 24) % 24;
    }

    // Random number of minutes between 1 and 59
    const randomSecs = (Math.floor(Math.random() * 59) + 1)
      .toString()
      .padStart(2, "0");

    // Format result with leading zeros
    const formatted = `${hour.toString().padStart(2, "0")}:${newMinute
      .toString()
      .padStart(2, "0")}:${randomSecs}`;

    return formatted;
  }

  addStartHour(arr) {
    return arr.map((item) => {
      let startHourText = this.randomizeTime(
        document.getElementById("startHour").value
      ).replace(":", ".");

      return { ...item, startHour: startHourText };
    });
  }

  format(arr) {
    let cleanArr = this.addStartHour(
      this.splitDateTime(this.filterValidDays(arr))
    );

    const result = ["No_Hari/Tanggal_Jam Datang_Jam Pulang_Keterangan"];

    cleanArr.forEach((element, index) => {
      let formatted = `${index + 1}_${element.day}, ${element.date} ${
        element.month
      } ${element.year}_${element.startHour}_${element.endHour}_-`;
      result.push(formatted);
    });

    return result;
  }
}

// Copy to clipboard feature
document.getElementById("copyBtn").addEventListener("click", function () {
  const output = document.getElementById("output");
  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand("copy");
  this.textContent = "Disalin";
  setTimeout(() => (this.textContent = "Salin Teks"), 1500);
});
