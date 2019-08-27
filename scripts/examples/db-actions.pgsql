select project_id, release.* from release
join package on release.package_id = package.id
join project on package.project_id = project.id
where project.id = 1
order by version;

update release set state = 'pending' where package_id = 3;
