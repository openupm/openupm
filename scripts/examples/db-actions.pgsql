-- Find release(s) for project x.
select project_id, release.* from release
  join package on release.package_id = package.id
  join project on package.project_id = project.id
  where project.id = 2
  order by version;

-- Update failed release(s) to pending for project x.
-- So it will rebuild with next project build.
update release set state = 'pending' where id in (
  select release.id from release
    join package on release.package_id = package.id
    join project on package.project_id = project.id
    where project.id = 2)
  and state = 'failed';
