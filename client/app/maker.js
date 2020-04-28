const handleGrave = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'},350);

    if($("GraveName").val()==''|| $("#GraveAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#smallForm").attr("action"), $("#smallForm").serialize(), function(){
        redirect({redirect: '/maker'});
        loadGraveFromServer();
    });
    return false;
};

const GraveFormProp = (props) => {
    return (
        <form id="smallForm"
            onSubmit={handleGrave}
            name="smallForm"
            action="/maker"
            method="POST"
            className="smallForm">

            <label htmlFor="name">Name: </label>
            <input id="GraveName" type="text" name="name" placholder="Grave Name" />
            <label htmlFor="age">Age: </label>
            <input id="GraveAge" type="text" name="age" placeholder="Grave Age" />
            <label htmlFor="Level">Level: </label>
            <input id="GraveLevel" type="text" name="level" placeholder="Grave Level" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSubmit" type="submit" value="Make Grave" />
        </form>
    );
};

const GraveList = function (props) {
    if (props.Graves.length === 0) {
        return (
            <div className="GraveList">
            <h3 className="emptyGrave">Nothing created yet</h3>
            </div>
        );
    }

    const GraveNodes = props.Graves.map(function (Grave) {
        return (
            <div key={Grave._id} className="Grave">
                <img src="/assets/img/Fform.jpeg" alt="Grave Form" className="GraveFace" />
                <h3 className="GraveName">Name: {Grave.name}</h3>
                <h3 className="GraveAge">Age: {Grave.age}</h3>
                <h3 className="GraveLevel">Level: {Grave.level}</h3>
                <h3 className="GraveTime">Created at: {Grave.createdData}</h3>
            </div>
        );
    });

    return (
        <div className="GraveList">
            {GraveNodes}
        </div>
    );
};

const loadGravesFromServer = () => {
    sendAjax('GET', '/getGraves', null, (data) => {
        ReactDOM.render(
            <GraveList Graves={data.Graves}/>, document.querySelector("#Graves")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <GraveFormProp csrf={csrf}/>, document.querySelector("#makeGrave")
    );
    ReactDOM.render(
        <GraveList Graves={[]}/>, document.querySelector("#Graves")
    );
    loadGravesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});