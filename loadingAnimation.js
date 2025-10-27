const modal = document.getElementById("loadingModal");

function showLoading(text = "Loading, please wait...") {
  modal.querySelector("p").textContent = text;
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.classList.add("opacity-100");
  setTimeout(
    () => modal.querySelector("div").classList.remove("translate-y-2"),
    10
  );
}

function hideLoading() {
  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0");
  modal.classList.add("pointer-events-none");
  modal.querySelector("div").classList.add("translate-y-2");
}
