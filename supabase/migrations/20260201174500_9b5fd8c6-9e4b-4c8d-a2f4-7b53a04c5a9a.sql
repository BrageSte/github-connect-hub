-- Add admin-only update/delete policies for files
DROP POLICY IF EXISTS "Admins can update files" ON public.files;
DROP POLICY IF EXISTS "Admins can delete files" ON public.files;

CREATE POLICY "Admins can update files"
  ON public.files
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete files"
  ON public.files
  FOR DELETE
  TO authenticated
  USING (is_admin());
