var botui = new BotUI('waste-bot');

botui.message
  .bot({
    photo: true,
    loading: true,
    delay:500,
    content: '안녕하세요? 챗봇 철이에요~ 폐기물처리에 대해 알려드려요!'
  })
  .then(function () {
     showReminderInput();
});

var showReminderInput = function () {
  botui.message
    .bot({
      photo: true,
      loading: true,
      delay: 500,
      type: 'html',
      content: '무엇이 궁금한가요?'
    })
    .then(function () {
      return botui.action.text({
        delay: 1000,
        action: {
          placeholder: '질문을 입력해주세요.'
        }
      })
    }).then(function (res) {
      function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie !== '') {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                  var cookie = jQuery.trim(cookies[i]);
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) === (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      }

      var csrftoken = getCookie('csrftoken');

      function csrfSafeMethod(method) {
          // these HTTP methods do not require CSRF protection
          return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
      }

      $.ajaxSetup({
          beforeSend: function(xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                  xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
          }
      });

/*      $(document).ready( function (data) {
      $('#myTable').DataTable();
      } );*/
      $.post('/chatbots', {'text': res}).done(function(data){
        console.log(data);

        if (data.context.state) == 'in_progress' {
          botui.message
          .bot({
            delay: 2000,
            loading: true,
            type: 'html',
            content: data.output.text
          }).then(function () {
            return botui.action.text({
              delay: 1000,
              action: {
                placeholder: '질문을 입력해주세요.'
              }
            })
          });
        }

        botui.message
        .bot({
         delay: 2000,
         loading: true,
         type: 'html',
         content: data.output.text
       });

       /*content = createContent(data);

       botui.message
       .bot({
         delay: 2000,
         loading: true,
         type: 'html',
         content: content
       });

       function createContent(data) {
         const PRICE = '비용';
         const HOW = '방법';

         result = ''

         if (data.intent == HOW) {
           result = '<div class="answer-table2"> 폐기물 <u>처리방법</u> 이에요!<br><br>' //+ res.value
           + '<table>\n' +
           '      <thead>\n' +
           '        <tr>\n' +
           '          <th>동주민센터</th><td>관할 동주민센터 직접방문 → 접수<br>→ 스티커 부착, 직접 폐기할수있어요!</td>\n' +
           '        </tr>\n' +
           '      </thead>\n' +
           '      <tbody>\n' +
           '        <tr>\n' +
           '          <th>구청</th><td>구청 홈페이지 접수 → 방문수거 신청할수있어요!</td>\n' +
           '        </tr>\n' +
           '        <tr>\n' +
           '          <th>대형폐가전</th><td>원형 보전 시 무상수거<br>→ 전체 또는 홈페이지 접수가 가능해요!</td>\n' +
           '        </tr>\n' +
           '        <tr>\n' +
           '          <th>재활용</th><td>재활용 가능 시 재활용센터에서 무상수거 가능해요!</td>\n' +
           '        </tr>\n' +
           '      </tbody>\n' +
           '    </table></div">'
           + '<div class="answer-table2">궁금한게 더 있으신가요?</div">';
         } else {
           cotent_start = '<div class="answer-table">폐기물 <u>처리' + data.intent + '</u> 에요!<br><br>';

           th = '';

           $.each(data.contents.header, function(index, value) {
             th += '<th>' + value + '</th>';
           });

           tb = ''

           $.each(data.contents.content, function(index, value) {
             tb += '<tr>';

             $.each(value, function(i, v) {
               tb += '<td>' + v + '</td>';
             });

             tb += '</tr>';
           });

           content_body = '<table border=1><thead>' + '<tr>' + th + '</tr>' + '</thead>' + '<tbody>' + tb + '</tbody></table></div>';
           content_etc = '<div class="answer-table2">'

           if (data.intent == PRICE) {
             content_etc +=  '*대형폐가전(원형보전) 또는 재활용 가능 시 : <b>무상수거</b> 가능해요!<br>'
           }

           content_end = '궁금한게 더 있으신가요?</div>';
           result = cotent_start + content_body + content_etc + content_end;
         }

         return result;
       }*/
      });

      return botui.action.button({
        type: 'html',
        delay: 1700,
        action: [{text: '처음으로', value: 'yes'}, {text: '견적문의', value: 'no'}, {text: '종료', value: 'no'}]
      })
    }).then(function (res) {
      if(res.value == 'yes') {
        showReminderInput();
      } else {
        botui.message.bot({photo:true,content:'이용해 주셔서 감사해요. 또 오세요! :D'});
      }
    });
  }

var inProgressDialog = function(res) {
  function getCookie(name) {
    var cookieValue = null;

    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');

      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  }

  var csrftoken = getCookie('csrftoken');

  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

/*      $(document).ready( function (data) {
  $('#myTable').DataTable();
  } );*/
  $.post('/chatbots', {'text': res}).done(function(data){
    console.log(data);

    if (data.context.state) == 'in_progress' {
      botui.message
      .bot({
        delay: 2000,
        loading: true,
        type: 'html',
        content: data.output.text
      }).then(function () {
        return botui.action.text({
          delay: 1000,
          action: {
            placeholder: '질문을 입력해주세요.'
          }
        })
      });
    }

    botui.message
    .bot({
     delay: 2000,
     loading: true,
     type: 'html',
     content: data.output.text
   });
 });
}
