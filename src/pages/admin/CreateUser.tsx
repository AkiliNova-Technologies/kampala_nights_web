import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronDown, ChevronUp, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export function CreateUserPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    admin: false,
    business: false,
    events: false,
    userRoles: false,
    campaigns: false,
    hotAndCold: false,
    revenue: false,
  });

  // Role-based permission presets
  const rolePermissions = {
    "super admin": {
      admin: true,
      business: true,
      events: true,
      userRoles: true,
      campaigns: true,
      hotAndCold: true,
      revenue: true,
    },
    admin: {
      admin: false,
      business: true,
      events: true,
      userRoles: true,
      campaigns: true,
      hotAndCold: true,
      revenue: false,
    },
    marketing: {
      admin: false,
      business: true,
      events: true,
      userRoles: false,
      campaigns: true,
      hotAndCold: true,
      revenue: false,
    },
    operations: {
      admin: false,
      business: true,
      events: true,
      userRoles: false,
      campaigns: false,
      hotAndCold: true,
      revenue: false,
    },
    finance: {
      admin: false,
      business: false,
      events: false,
      userRoles: false,
      campaigns: false,
      hotAndCold: false,
      revenue: true,
    },
    helpdesk: {
      admin: false,
      business: true,
      events: false,
      userRoles: false,
      campaigns: false,
      hotAndCold: false,
      revenue: false,
    },
  };

  const [permissions, setPermissions] = useState({
    admin: false,
    business: false,
    events: false,
    userRoles: false,
    campaigns: false,
    hotAndCold: false,
    revenue: false,
  });

  // Auto-select permissions when role changes
  useEffect(() => {
    if (
      selectedRole &&
      rolePermissions[selectedRole as keyof typeof rolePermissions]
    ) {
      setPermissions(
        rolePermissions[selectedRole as keyof typeof rolePermissions]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole]);

  const toggleCard = (cardKey: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const handlePermissionChange = (
    permissionKey: keyof typeof permissions,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className=" space-y-6 p-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                className="p-2 bg-background dark:bg-card"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  Back to User Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* Create New User Section */}
          <div className="space-y-6">
            <Card className="rounded-lg shadow-sm border p-6">
              <div className="flex flex-row gap-6">
                <div className="size-8 p-1 bg-[#EEF2FF] rounded-sm">
                  <User2Icon className="text-[#5014D0]" />
                </div>
                <h2 className="text-2xl font-bold">Create New User</h2>
              </div>
              <p className="text-gray-600">
                Add a new team member with specific role assignments and
                permissions
              </p>

              {/* User Profile Section */}
              <div className="mb-8">
                <div className="flex flex-row gap-4">
                  <div className="size-8 p-1 bg-[#EEF2FF] rounded-sm">
                  <User2Icon className="text-[#5014D0]" />
                </div>
                  <h3 className="text-lg font-semibold mb-4">User Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter First Name"
                      className="h-12"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter Last Name"
                      className="h-12"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email Address"
                      className="h-12"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter Phone Number"
                      className="h-12"
                    />
                  </div>

                  {/* Primary Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Department</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger className="w-full min-h-12">
                        <SelectValue placeholder="Select Department e.g Marketing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="helpdesk">Helpdesk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Primary Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Primary Role</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger className="w-full min-h-12">
                        <SelectValue placeholder="Select Primary Role e.g Head Marketing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="helpdesk">Helpdesk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Assign Permissions Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Assign Permissions
                </h3>

                <div className="space-y-6">
                  {/* Admin Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="admin-permission"
                          checked={permissions.admin}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("admin", checked)
                          }
                        />
                        <Label
                          htmlFor="admin-permission"
                          className="font-medium text-lg"
                        >
                          Admin
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("admin")}
                      >
                        {expandedCards.admin ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.admin && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[
                          "access dashboard",
                          "editing recent business",
                          "suspending business",
                          "create business",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`admin-${index}`} />
                            <Label
                              htmlFor={`admin-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Business Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="business-permission"
                          checked={permissions.business}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("business", checked)
                          }
                        />
                        <Label
                          htmlFor="business-permission"
                          className="font-medium text-lg"
                        >
                          Business
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("business")}
                      >
                        {expandedCards.business ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.business && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[
                          "access dashboard",
                          "editing recent business",
                          "suspending business",
                          "create business",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`business-${index}`} />
                            <Label
                              htmlFor={`business-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Events Section */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="event-permission"
                          checked={permissions.events}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("events", checked)
                          }
                        />
                        <Label
                          htmlFor="event-permission"
                          className="font-medium text-lg"
                        >
                          Events
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("events")}
                      >
                        {expandedCards.events ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.events && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          "access event dashboard",
                          "editing events",
                          "suspending events",
                          "create events",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`event-${index}`} />
                            <Label
                              htmlFor={`event-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* User roles Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="user-roles-permission"
                          checked={permissions.userRoles}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userRoles", checked)
                          }
                        />
                        <Label
                          htmlFor="user-roles-permission"
                          className="font-medium text-lg"
                        >
                          User Roles
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("userRoles")}
                      >
                        {expandedCards.userRoles ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.userRoles && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[
                          "access users",
                          "editing users",
                          "suspending users",
                          "create users",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`user-role-${index}`} />
                            <Label
                              htmlFor={`user-role-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Campaigns Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="campaign-permission"
                          checked={permissions.campaigns}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("campaigns", checked)
                          }
                        />
                        <Label
                          htmlFor="campaign-permission"
                          className="font-medium text-lg"
                        >
                          Campaigns
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("campaigns")}
                      >
                        {expandedCards.campaigns ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.campaigns && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {[
                          "access campaign dashboard",
                          "editing campaigns",
                          "suspending campaigns",
                          "create campaigns",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`campaign-${index}`} />
                            <Label
                              htmlFor={`campaign-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Hot and Cold Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hot-and-cold-permission"
                          checked={permissions.hotAndCold}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("hotAndCold", checked)
                          }
                        />
                        <Label
                          htmlFor="hot-and-cold-permission"
                          className="font-medium text-lg"
                        >
                          Hot and Cold
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("hotAndCold")}
                      >
                        {expandedCards.hotAndCold ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.hotAndCold && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          "access event dashboard",
                          "editing hot and cold",
                          "suspending hot and cold",
                          "create hot and cold",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`hot-cold-${index}`} />
                            <Label
                              htmlFor={`hot-cold-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Revenue Permissions */}
                  <Card className="space-y-3 p-6">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="revenue-permission"
                          checked={permissions.revenue}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("revenue", checked)
                          }
                        />
                        <Label
                          htmlFor="revenue-permission"
                          className="font-medium text-lg"
                        >
                          Revenue
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCard("revenue")}
                      >
                        {expandedCards.revenue ? (
                          <ChevronUp className="size-5" />
                        ) : (
                          <ChevronDown className="size-5" />
                        )}
                      </Button>
                    </div>
                    {expandedCards.revenue && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          "access revenue dashboard",
                          "editing revenue",
                          "suspending revenue",
                          "create revenue",
                        ].map((permission, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch id={`revenue-${index}`} />
                            <Label
                              htmlFor={`revenue-${index}`}
                              className="text-sm"
                            >
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  className="flex h-12 text-md flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button className="bg-[#5014D0] hover:bg-[#5014D0]/70 text-white flex h-12 text-md flex-1">
                  Create User
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
