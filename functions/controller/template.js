const template = `
<p>Hi there!</p>

<p>You requested a magic link from us to log in to the system. If you didn't ask for a magic link, feel free to ignore this email.</p>
<% if (permittedTokens.length > 1) { %>
    <p>It looks like a couple of folks use your email address in our system. Click on the magic link below your name and picture to login.</p>
    <% for (const person of permittedTokens) { %>
        <div class="person">
            <img src="<%= person.avatar %>" alt="<%= person.firstName %>'s Avatar" />
            <p><strong><%= person.name %></strong></p>
            <a href="https://relationships.flatland.church/token?token=<%= person.token %>">Sign In</a>
        </div>
    <% } %>
<% } else { %>
    <a href="https://relationships.flatland.church/token?token=<%= permittedTokens[0].token %>">Sign In</a>
<% } %>

<p>Thanks so much for all you do.</p>
<br />
<p>~ Flatland Team</p>
`;

module.exports = template;
