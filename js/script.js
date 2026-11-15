$(document).ready(function () {

//Artistin valinta dropdown-lista
    $("#artistSelect").change(function() {
        $("#searchInput").val("");

        let artist = $(this).val();

        if (artist !== "") {
            loadAlbums(artist);
        }
    });

//Artistin haku hakukenttä
    $("#searchBtn").click(function () {
        let artist = $("#searchInput").val().trim();

        if (artist!== "") {
            $("#artistSelect").val("");
            loadAlbums(artist);
        }
    });
});

//Artistin albumien haku
function loadAlbums(artistName) {

    loadTopTracks(artistName);

    $("#albums").html("<p class='col-12 text-center'>Ladataan albumeita..</p>");

    $.ajax({
        url:
        "/.netlify/functions/topalbums?artist=" +
        encodeURIComponent(artistName),
        method: "GET",
        dataType: "json",
        success: function (data) {

            if (!data.topalbums) {
                $("#tracks").html("");
                $("#albums").html(
                    "<p class='error-message'>Artistia ei löytynyt.</p>"
                );
                return;
            }

            let output = "";
            const albumList = data.topalbums.album;

            for (let i = 0; i < albumList.length; i++) {

                let image = albumList[i].image[3]["#text"];

                if (image === "") {
                    image = 
                    "https://via.placeholder.com/300x300?text=No+Image";
                }
                output +=
                "<div class='col-md-3'>" + 
                "<div class='card h-100'>" +
                "<img src='" +
                image +
                "' class='card-img-top'>" +

                "<div class='card-body'>" +
                "<h5 class='card-title'>" +
                albumList[i].name +
                "</h5>" + 

                "<a href='" +
                albumList[i].url +
                "' target='_blank' class='btn btn-primary'>" +
                "Lisätietoja" +
                "</a>" + 

                "</div>" +
                "</div>" +
                "</div>";
            }

            $("#albums").html(output);
        },

        error: function () {
          $("#albums").html(
            "<p>Tietojen lataaminen epäonnistui.</p>"
          );
        }
    });
}

//Top3 kappaleen haku
function loadTopTracks(artistName) {

    $.ajax({
        url:
        "/.netlify/functions/toptracks?artist=" +
        encodeURIComponent(artistName),
        method: "GET",
        dataType: "json",
        success: function (data) {

            if (!data.toptracks) {
                $("#tracks").html("");
                return;
            }

            let output =
            "<div class='card mb-4'>" +
            "<div class='card-body'>" +
            "<h3>" +
            artistName +
            " - suosituimmat kappaleet" +
            "</h3>";

            for (
                let i = 0;
                i < data.toptracks.track.length && i < 3;
                i++
            ) {
                output +=
                "<p>" + 
                (i + 1) + 
                ". " +
                data.toptracks.track[i].name +
                "</p>";
            }

            output +=
            "</div>" +
            "</div>";

            $("#tracks").html(output);
        },

        error: function () {
            $("#tracks").html("");
        }
    });
}