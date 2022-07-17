const searchBtn = document.getElementById("search-btn");
const formFieldSectionElement = document.getElementById("form-field");

function loadSearchView() {
  formFieldSectionElement.innerHTML = `
  <form>
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

    </form>
`;
    
}

searchBtn.addEventListener("click", loadSearchView);
