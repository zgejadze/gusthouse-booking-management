const searchBtn = document.getElementById("search-btn");
const bookingBtn = document.getElementById("new-booking-btn");

const formFieldSectionElement = document.getElementById("form-field");
const resultFieldElement = document.getElementById("result-field");

const roomNumbers = [
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "2-1",
  "2-2",
  "2-3",
  "2-4",
  "3-1",
  "3-2",
  "3-3",
  "3-4",
];

////////////// back button ///////////////////
function goToLandingPage(event) {
  event.target.remove();
  formFieldSectionElement.innerHTML = "";
  resultFieldElement.innerHTML = "";
  searchBtn.style.display = "inline-block";
  searchBtn.nextElementSibling.style.display = "inline-block";
}

function hideControllBtns() {
  bookingBtn.style.display = "none";
  searchBtn.style.display = "none";
}

////////// search tab opener button ///////////////////
function loadSearchView() {
  formFieldSectionElement.innerHTML = `<form>
    <p>
        <label for="room-number">ოთახის ნომერი</label>
        <select name="room-number" id="room-number">
            <option>1-1</option>
            <option >1-2</option>
            <option>2-2</option>
        </select>
    </p>
    <p>
        <label for="date">თარიღი</label>
        <input type="date" name="start-date" id="start-date">
        <input type="date" name="end-date" id="end-date">

    </p>
    <button>ძებნა</button>
    </form>`;

  hideControllBtns();

  const backBtn = document.createElement("button");
  backBtn.textContent = "უკან";
  backBtn.id = "back-btn";
  searchBtn.parentElement.appendChild(backBtn);
  backBtn.addEventListener("click", goToLandingPage);
}

searchBtn.addEventListener("click", loadSearchView);

///////// open booking form //////////////
function loadBookingForm() {
  formFieldSectionElement.innerHTML = `<form method="POST" action="/newbooking">
  <p>
  <label for="booking-name">ჯავშნის დასახელება</label>
  <input type="text" id="booking-name" name="booking-name" required maxlength="60" />
  </p>
  <p>
    <label for="booking-source">ჯავშნის წყარო</label>
    <select name="booking-source" id="booking-source" required>
      <option value="facebook">Facebook</option>
      <option value="suggestion">Friend Suggested</option>
      <option value="booking.com">Booking.com</option>
      <option value="taxi">taxi driver</option>
      <option value="other">other</option>
    </select>
  </p>
  <p>
    <label for="room-number">ოთახის ნომერი</label>
    <select name="room-number" id="room-number" required>
      
    </select>
  </p>
  <p>
    <label>თარიღი</label>
    <input type="date" name="date-start" id="date-start" required>
    <input type="date" name="date-end" id="date-end" required>
  </p>
  <button>დაჯავშნა</button>
</form>
`;

  const roomNumberSelectElement = document.getElementById("room-number");
  for (const room of roomNumbers) {
    const roomOptionElement = document.createElement("option");
    roomOptionElement.value = room;
    roomOptionElement.textContent = room;
    roomNumberSelectElement.appendChild(roomOptionElement);
  }

  hideControllBtns();
  const backBtn = document.createElement("button");
  backBtn.textContent = "უკან";
  backBtn.id = "back-btn";
  bookingBtn.parentElement.appendChild(backBtn);
  backBtn.addEventListener("click", goToLandingPage);
}

bookingBtn.addEventListener("click", loadBookingForm);

////////// validate booking form on change //////
