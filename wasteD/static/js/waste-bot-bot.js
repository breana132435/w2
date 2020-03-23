var botui = new BotUI('waste-bot');

botui.message.bot({
  photo: true,
  loading: true,
  delay:500,
  content: '안녕하세요? 챗봇 철이에요~ 대형생활폐기물 처리에 관한 비용, 업체, 방법에 대해 알려드려요!'
}).then(function () {
  showReminderInput();
});

var showReminderInput = function () {
  botui.action.text({
    delay: 3000,
    action: {
      placeholder: '질문을 입력해주세요.'
    }
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

      $.post('/chatbots', {'text': res}).done(function(data){
        console.log(data);

        if (data.hasOwnProperty('context')) {
          botui.message.bot({
            photo: true,
            delay: 2000,
            loading: true,
            type: 'html',
            content: data.output.text
         });
       } else {
         content = createContent(data);
         botui.message.bot({
           photo: true,
           delay: 2000,
           loading: true,
           type: 'html',
           content: content
         });

         function createContent(data) {
           const PRICE = 'price';
           const HOW = 'how';

           result = ''

           if (data.intent == HOW) {
             result = '<div class="answer-table2">' + data.title + '<br><br>' //+ res.value
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
             '    </table></div">';
           } else {
             cotent_start = '<div class="answer-table">' + data.title + '<br><br>';

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

             content_end = '</div>';
             result = cotent_start + content_body + content_etc + content_end;

           }

           return result;
         }

         botui.message.bot({
           photo: true,
           loading: true,
           delay: 3000,
           content: '궁금한 것이 더 있으신가요?'
         });
       }
      });
    }).then(function (res) {
      console.log(res)
      showReminderInput();
    })
  }
