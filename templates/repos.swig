{% extends '_report-base.swig' %}

{% block main %}
<h2>Trending AWS Javascript Repos</h2>
<table class="data">
  <thead>
    <tr>
      <th>repo</th>
      <th>owner</th>
      <th>avatar</th>
      <th>description</th>
      <th>stars</th>
      <th>URL</th>
      <th>created</th>
      <th>updated</th>
    </tr>
  </thead>
  <tbody>
  {% for repo in items %}
    <tr>
      <td>{{repo.full_name}}</td>
      <td>{{repo.owner.login}}</td>
      <td><img src="{{repo.owner.avatar_url}}" alt="{{repo.owner.login}}" style="width:50px" /></td>
      <td>{{repo.description}}</td>
      <td>{{repo.stargazers_count}}</td>
      <td><a href="{{repo.html_url}}">{{repo.html_url}}</a></td>
      <td style="white-space: nowrap;">{{repo.created_at|date('Y-m-d')}}</td>
      <td style="white-space: nowrap;">{{repo.updated_at|date('Y-m-d')}}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>

{% endblock %}
