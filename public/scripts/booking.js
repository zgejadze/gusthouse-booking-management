const searchBtn = document.getElementById("search-btn");
const formFieldSectionElement = document.getElementById("form-field");
const resultFieldElement = document.getElementById("result-field");

function goToLandingPage(event) {
  event.target.remove();
  formFieldSectionElement.innerHTML = "";
  clickedSearch = false;
  resultFieldElement.innerHTML = "";
  searchBtn.nextElementSibling.style.display = "inline-block";
}

let clickedSearch;
function loadSearchView() {
  if (clickedSearch) {
    resultFieldElement.innerHTML = `<ul>
      <li>
      <span>ID</span>
      <span>ჯავშნის ღირებულება</span>
      <span> ჯავშნის წყარო </span>
      <span> ოთახის ნომერი </span>
      <span> თარიღი დან </span>
      <span> თარიღი მდე </span>
      </li>
      </ul>`;
    alert("get request will be sent by ajax if input field are filled");
    return;
  }

  clickedSearch = true;
  searchBtn.nextElementSibling.style.display = "none";
  formFieldSectionElement.innerHTML = `<form>
    <p>
        <label for="room-number">ოთახის ნომერი</label>
        <select name="room-number" id="room-number">
            <option>1-1</option>
            <option value="">1-2</option>
            <option value="">2-2</option>
        </select>
    </p>
    <p>
        <label for="date">თარიღი</label>
        <input type="date" name="start-date" id="start-date">
        <input type="date" name="end-date" id="end-date">

    </p>

    </form>`;
  const backBtn = document.createElement("button");
  backBtn.textContent = "უკან";
  backBtn.id = "back-btn";
  console.log(searchBtn.parentElement);
  searchBtn.parentElement.appendChild(backBtn);
  backBtn.addEventListener("click", goToLandingPage);
}

searchBtn.addEventListener("click", loadSearchView);
