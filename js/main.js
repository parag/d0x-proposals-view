$(document).ready(function() {

    var url = "https://api.github.com/repos/district0x/district-proposals/issues";
    $.ajaxSetup({
      headers : {
        'Accept' : 'application/vnd.github.squirrel-girl-preview'
      }
    });
    $.getJSON(
        url,
        {
            per_page: 200
        }
    )
    .done(function(data) {
      $('#loading').hide();
        buildTable(data);
    })
    .fail(function(error) {
        console.log("Request Failed:", error);
    });

    var buildTable = function(issues) {
        var table = $('<table />');
        var tbody = $('<tbody />');
        var thead = $('<thead />');
        var theadRow = $('<tr />').append('<th>Title</th>' , '<th>Created At</th>', '<th>Upvotes</th>', '<th>Comments</th>', '<th>Author</th>');

        $(issues).each(function(index, issue) {
            var row = $('<tr />');
            var title = $('<td />').text(issue.title);
            var startDate = $('<td />').text(dateFormatter(issue.created_at));
            var descriptionRow = $('<tr />').addClass('hidden');
            var ibody = issue.body
            var moreInfo = $('<a />').text('Find out more').attr('href', issue.html_url).attr('target', '_blank');
            var purpose1 = ibody.split('Purpose');
            var purpose2 = purpose1[purpose1.length - 1].split("Description");
            var upVotes = $('<td />').text(issue.reactions["+1"]);
            var comments = $('<td />').text(issue.comments);
            var purposeInfo = purpose2[0].replace(/#/g,'').replace(/:/g,'');
            var description = $('<td colspan="4" />').html(purposeInfo);

            row.append(title, startDate, upVotes, comments, issue.user.login);
            row.addClass('clickable');
            description.append(moreInfo);
            descriptionRow.append(description);
            tbody.append(row, descriptionRow);
        });

        thead.append(theadRow);
        table.addClass('table table-hover');
        table.append(thead, tbody);
        $('#app').append(table);

        $('table tr.clickable').on('click', function(event){
            $(this).next().toggleClass('hidden');
        });

        $('#search').on('keyup', function(event){
            var input = $(this).val().toLowerCase();

            $('table tbody tr.clickable').each(function(index, row) {
                var titleCell = $(row).children()[0];
                var titleText = $(titleCell).text().toLowerCase();

                if (titleText.indexOf(input) === -1) {
                    $(row).addClass('hidden');
                    $(row).next().addClass('hidden');
                } else {
                    $(row).removeClass('hidden');
                }
            });
        });
    };

    var dateFormatter = function(dateString){
        var date = new Date(dateString);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0'  +  month : month;
        date = day + '/' + month + '/' + year;
        return date;
    };

});
